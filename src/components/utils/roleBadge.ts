export const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case "OWNER":
      return "bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200";
    case "ADMIN":
      return "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200";
    case "CUSTOMER":
      return "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
};
