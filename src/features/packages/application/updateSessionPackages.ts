import {
  createSessionGuard,
  SessionTracker,
} from "@features/auth/session/sessionTracker";
import { PackageStatus } from "@features/packages/domain/package.enums";
import { packageService as defaultPackageService } from "@features/packages/package.dependencies";
import { PackageService } from "@features/packages/services/PackageService";
import {
  PackageState,
  usePackageStore,
} from "@features/packages/store/usePackageStore";
import { loadPackages } from "./loadPackages";

export async function updateSessionPackages(
  userId: string,
  status: PackageStatus,
  receiverName?: string,
  dependencies: {
    packageService?: Pick<
      PackageService,
      | "updateAndSendMultiple"
      | "getAllPackages"
      | "getPendingCount"
    >;
    store?: Pick<
      PackageState,
      | "currentSessionPackages"
      | "isSyncingSession"
      | "packages"
      | "setSyncingSession"
      | "resetSession"
      | "setSessionPackages"
      | "setPackages"
    >;
    sessionTracker?: Pick<
      SessionTracker,
      "getSessionGeneration"
    >;
  } = {},
): Promise<{
  success: boolean;
  sent: number;
  failed: number;
}> {
  const service =
    dependencies.packageService ?? defaultPackageService;
  const store =
    dependencies.store ?? usePackageStore.getState();
  const guard = createSessionGuard(
    dependencies.sessionTracker,
  );

  const currentSessionPackages =
    store.currentSessionPackages;
  if (
    currentSessionPackages.length === 0 ||
    store.isSyncingSession
  ) {
    return { success: false, sent: 0, failed: 0 };
  }

  store.setSyncingSession(true);
  try {
    const result = await service.updateAndSendMultiple(
      currentSessionPackages,
      userId,
      status,
      receiverName,
    );
    if (!guard.isValid()) {
      return {
        success: result.success,
        sent: result.data?.sent ?? 0,
        failed: result.data?.failed ?? 0,
      };
    }
    loadPackages(userId, {
      packageService: service,
      store,
      sessionTracker: dependencies.sessionTracker,
    });
    if (result.success) {
      store.resetSession();
    } else if (result.data) {
      const failedPackageIds = new Set(
        result.data.failedPackages.flatMap((p) =>
          p.id !== undefined ? [p.id] : [],
        ),
      );
      const persistedFailed = (
        dependencies.store?.packages ??
        usePackageStore.getState().packages
      ).filter(
        (p) =>
          p.id !== undefined && failedPackageIds.has(p.id),
      );
      store.setSessionPackages(
        persistedFailed.length > 0
          ? persistedFailed
          : result.data.failedPackages,
      );
    }
    return {
      success: result.success,
      sent: result.data?.sent ?? 0,
      failed: result.data?.failed ?? 0,
    };
  } catch {
    return {
      success: false,
      sent: 0,
      failed: currentSessionPackages.length,
    };
  } finally {
    store.setSyncingSession(false);
  }
}
