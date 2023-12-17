export const Routes = {
  Auth: {
    Me: "/auth/@me",
    Login: "/auth/login",
    Register: "/auth/register",
  },
  Settings: {
    VerifyEmail: "/settings/verify",
    ResetPassword: "/settings/resetPassword",
    UpdateProfile: "/settings/updateProfile",
  },

  Databases: (id?: string) => {
    if (id) return `/databases/${id}`;
    return "/databases";
  },

  Destinations: (id?: string) => {
    if (id) return `/destinations/${id}`;
    return "/destinations";
  },

  Backups: (id?: string) => {
    if (id) return `/databases/backups/${id}`;
    return "/databases/backups";
  },
};
