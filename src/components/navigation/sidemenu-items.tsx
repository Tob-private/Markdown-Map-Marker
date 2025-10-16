import { useState } from "react";

interface MenuItem {
  key: string | number;
  label: string;
  href?: string;
  children?: MenuItem[];
}

interface MenuItemProps {
  item: MenuItem;
}

function MenuItemComponent({ item }: MenuItemProps) {
  const [collapsed, setCollapsed] = useState(false);

  const handleCollapse = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    setCollapsed((prev) => !prev);
  };

  return (
    <li>
      {item.href ? (
        <a href={item.href} onClick={(e) => e.stopPropagation()}>
          {item.label}
        </a>
      ) : (
        <span onClick={!item.href ? handleCollapse : undefined}>
          {item.label}
        </span>
      )}
      {item.children && !collapsed && (
        <ul>
          {item.children
            .sort((a, b) => {
              // Put children with their own children arr first
              const childrenDiff =
                Number(a.children !== undefined) -
                Number(b.children !== undefined);

              if (childrenDiff !== 0) return childrenDiff;

              // Prioritize items with the same label as parent
              return (
                Number(b.label === item.label) - Number(a.label === item.label)
              );
            })
            .map((child) => (
              <MenuItemComponent key={child.key} item={child} />
            ))}
        </ul>
      )}
    </li>
  );
}

export default function SidemenuItems({
  menuItems,
}: {
  menuItems: MenuItem[];
}) {
  // Put items without children at the start
  menuItems = menuItems.sort(
    (a, b) =>
      Number(b.children === undefined) - Number(a.children === undefined)
  );

  return (
    <ul>
      {menuItems.map((item) => (
        <MenuItemComponent key={item.key} item={item} />
      ))}
    </ul>
  );
}
