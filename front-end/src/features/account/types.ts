export interface Guest {
  id: string;
  name: string;
  email: string;
  /**
   * Profile photo: "sample:<slug>" for a bundled avatar (the seeded default, 1.12t) or an
   * uploaded 256px JPEG data URL (1.12s); absent = a sample avatar picked from the name.
   */
  avatar?: string;
}
