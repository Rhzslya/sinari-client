const getStatusContent = () => {
  switch (service.status) {
    case ServiceStatus.PENDING:
      return {
        title: t("track_service.status.pending.title", "Device Received"),
        desc: t(
          "track_service.status.pending.desc",
          "We have received your device and it's currently in the queue for inspection.",
        ),
        color: "bg-primary",
      };
    case ServiceStatus.PROCESS:
      return {
        title: t("track_service.status.process.title", "Repairing"),
        desc: t(
          "track_service.status.process.desc",
          "Our technician is currently working on your device. Please wait for further updates.",
        ),
        color: "bg-blue-600",
      };
    case ServiceStatus.FINISHED:
      return {
        title: t("track_service.status.finished.title", "Ready for Pickup"),
        desc: t(
          "track_service.status.finished.desc",
          "Great news! Your device is fixed and ready to be collected at our store.",
        ),
        color: "bg-emerald-500",
      };
    case ServiceStatus.TAKEN:
      return {
        title: t("track_service.status.taken.title", "Service Completed"),
        desc: t(
          "track_service.status.taken.desc",
          "The device has been collected. Thank you for choosing our service!",
        ),
        color: "bg-emerald-700",
      };
    case ServiceStatus.CANCELLED:
      return {
        title: t("track_service.status.cancelled.title", "Service Cancelled"),
        desc: t(
          "track_service.status.cancelled.desc",
          "This service has been cancelled. Please contact us for more information.",
        ),
        color: "bg-slate-800",
      };
    default:
      return {
        title: service.status,
        desc: "Checking status...",
        color: "bg-primary",
      };
  }
};

const statusInfo = getStatusContent();
