import { NavLink } from 'react-router-dom';
import { navGroups, NavItem } from '@/config/navGroups';

export default function Sidebar() {
  return (
    <aside className="w-72 shrink-0 border-r bg-gray-50 overflow-y-auto">
      {navGroups.map((group) => (
        <div key={group.title} className="px-4 py-3">
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
            {group.title}
          </h4>

          <nav className="flex flex-col gap-1">
            {group.items.map((item: NavItem) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  [
                    'flex items-start justify-between gap-2 rounded-md px-3 py-2 transition',
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-800 hover:bg-gray-100',
                  ].join(' ')
                }
              >
                <span className="leading-tight">
                  {item.title}
                  {item.subtitle && (
                    <span className="block text-xs text-gray-500">{item.subtitle}</span>
                  )}
                </span>

                {item.badge && (
                  <span className="mt-0.5 rounded bg-amber-400 px-1.5 py-0.5 text-[10px] font-bold text-black">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      ))}
    </aside>
  );
}