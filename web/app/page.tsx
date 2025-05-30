import { redirect } from "next/navigation"

export default function Home() {
  // In a real application, you would check the authentication status here
  // Check authentication status from local storage
  let isAuthenticated = false;
  if (typeof window !== 'undefined') {
    isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  }

  if (isAuthenticated) {
    redirect("/chat");
  } else {
    redirect("/login");
  }
}
