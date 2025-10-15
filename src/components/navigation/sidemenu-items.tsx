interface MenuItem {
  key: string | number;
  label: string;
  href?: string;
  children?: MenuItem[];
}

export default function SidemenuItems({
  menuItems,
}: {
  menuItems: MenuItem[];
}) {
  const renderMenu = (items: MenuItem[]) => {
    return (
      <ul>
        {items.map((item) => (
          <li key={item.key}>
            {item.href ? <a href={item.href}>{item.label}</a> : item.label}
            {item.children && renderMenu(item.children)}
          </li>
        ))}
      </ul>
    );
  };

  return <>{renderMenu(menuItems)}</>;
}
