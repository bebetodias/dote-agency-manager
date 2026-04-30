import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  // Verificando autenticação
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }

  // Buscando os dados do banco usando Prisma
  const currentUser = await prisma.user.findUnique({
    where: { email: session.user?.email || "" }
  });

  const jobs = await prisma.job.findMany({
    include: {
      client: true,
      pieces: true,
    }
  });

  const commemorativeDates = await prisma.commemorativeDate.findMany();
  const teamMembers = await prisma.user.findMany();

  return (
    <DashboardClient 
      currentUser={currentUser} 
      jobs={jobs} 
      commemorativeDates={commemorativeDates} 
      teamMembers={teamMembers} 
    />
  );
}
