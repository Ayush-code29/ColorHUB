
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import AdminDashboard from "../admin/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPaintPage() {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    redirect("/admin_paint/login");
  }

  return <AdminDashboard />;
}
