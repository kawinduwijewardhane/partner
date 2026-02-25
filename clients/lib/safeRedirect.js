export function getSafeRedirect(searchParams) {
  const redirect = searchParams?.get("redirect");

  if (!redirect) return "/users/profile";

  if (!redirect.startsWith("/")) return "/users/profile";
  if (redirect.includes("http")) return "/users/profile";
  if (redirect.includes("//")) return "/users/profile";

  return redirect;
}