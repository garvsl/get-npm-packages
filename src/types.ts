export type UserPackages = {
  total: number;
  username: string;
  packages: Package[];
};

export type Package = {
  id: number;
  title: string;
  description: string;
  version: string;
  updated: string;
  link: string;
};

export type Downloads = {
  downloads: number;
  start: string;
  end: string;
  package: string;
};
