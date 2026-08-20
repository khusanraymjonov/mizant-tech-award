'use client';

import { useRouter } from 'next/navigation';
import { workspaceRoles, type WorkspaceRole } from '../lib/workspaces';

export function RoleSwitcher({ currentRole }: { currentRole: WorkspaceRole }) {
  const router = useRouter();
  const visibleWorkspaceRoles =
    currentRole === 'admin' ? workspaceRoles : workspaceRoles.filter(([role]) => role !== 'admin');

  return (
    <label className="role-switcher">
      <span>View platform as</span>
      <span className="sr-only" id="role-switcher-description">
        This changes the demonstration workspace. It does not authenticate a real user.
      </span>
      <select
        aria-label="View platform as another role"
        aria-describedby="role-switcher-description"
        value={currentRole}
        onChange={(event) =>
          router.push(visibleWorkspaceRoles.find(([id]) => id === event.target.value)![1].route)
        }
      >
        {visibleWorkspaceRoles.map(([id, profile]) => (
          <option value={id} key={id}>
            {profile.label}
          </option>
        ))}
      </select>
    </label>
  );
}
