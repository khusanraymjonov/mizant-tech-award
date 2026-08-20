export type WorkspaceRole =
  | 'investor'
  | 'sme'
  | 'originator'
  | 'operations'
  | 'compliance'
  | 'shariah'
  | 'ownership'
  | 'admin';

export const workspaceProfiles: Record<
  WorkspaceRole,
  { label: string; route: string; name: string; descriptor: string; initials: string }
> = {
  investor: {
    label: 'Investor',
    route: '/demo',
    name: 'Alex Morgan',
    descriptor: 'Investor workspace',
    initials: 'AM',
  },
  sme: {
    label: 'SME applicant',
    route: '/applications',
    name: 'Nodira Karimova',
    descriptor: 'SME director',
    initials: 'NK',
  },
  originator: {
    label: 'Originator',
    route: '/origination',
    name: 'Farida Rasulova',
    descriptor: 'Relationship manager',
    initials: 'FR',
  },
  operations: {
    label: 'Operations maker',
    route: '/governance',
    name: 'Samira Karim',
    descriptor: 'Operations maker',
    initials: 'SK',
  },
  compliance: {
    label: 'Independent checker',
    route: '/reviews',
    name: 'Daniel Reed',
    descriptor: 'Compliance checker',
    initials: 'DR',
  },
  shariah: {
    label: 'Shariah reviewer',
    route: '/shariah',
    name: 'Dr. Hana Rahman',
    descriptor: 'Independent Shariah reviewer',
    initials: 'HR',
  },
  ownership: {
    label: 'Ownership admin',
    route: '/ownership',
    name: 'Laylo Ismailova',
    descriptor: 'Register administrator',
    initials: 'LI',
  },
  admin: {
    label: 'Platform admin',
    route: '/admin',
    name: 'Khusniddin Raymjonov',
    descriptor: 'Platform administrator',
    initials: 'KR',
  },
};

export const workspaceRoles = Object.entries(workspaceProfiles) as [
  WorkspaceRole,
  (typeof workspaceProfiles)[WorkspaceRole],
][];
