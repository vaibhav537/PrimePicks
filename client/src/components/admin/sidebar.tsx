import React, { act, useEffect, useState } from "react";
import { BiSolidCategory } from "react-icons/bi";
import { FaHome, FaShoppingCart } from "react-icons/fa";
import { BsFillBarChartFill, BsPhoneFill } from "react-icons/bs";
import { MdAddBox } from "react-icons/md";
import { HiCollection } from "react-icons/hi";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  MenuItem,
  Sidebar,
  sidebarClasses,
  SubMenu,
} from "react-pro-sidebar";
import Image from "next/image";

const Side = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [selectedItem, setSelectedItem] = useState("/admin/dashboard");
  useEffect(() => {
    setSelectedItem(pathname);
  }, [pathname]);

  const menuItems = [
    { label: "Dashboard", icon: <FaHome />, link: "/admin/dashboard" },
    {
      label: "Category",
      icon: <BiSolidCategory />,
      subMenuItems: [
        {
          label: "Add Category",
          icon: <MdAddBox />,
          link: "/admin/category/add-category",
        },
        {
          label: "All Category",
          icon: <HiCollection />,
          link: "/admin/category/all-category",
        },
        {
          label: "Reports",
          icon: <BsFillBarChartFill />,
          link: "/admin/category/reports",
        },
      ],
    },
    {
      label: "Product",
      icon: <BsPhoneFill />,
      subMenuItems: [
        {
          label: "Add Product",
          icon: <MdAddBox />,
          link: "/admin/products/add-products",
        },
        {
          label: "All Products",
          icon: <HiCollection />,
          link: "/admin/products/all-products",
        },
        {
          label: "Reports",
          icon: <BsFillBarChartFill />,
          link: "/admin/products/reports",
        },
      ],
    },
    {
      label: "Orders",
      icon: <FaShoppingCart />,
      link: "admin/orders",
    },
  ];

  const handleItemClick = (link: string) => {
    setSelectedItem(link);
    router.push(link);
  };

  return (
    <div className="min-h-[100vh] overflow-hidden">
      <Sidebar
        className="h-full overflow-hidden"
        rootStyles={{
          [`.${sidebarClasses.container}`]: {
            backgroundColor: "#141B24",
            "&:hover": {
              backgroundColor: "#141B24",
            },
          },
        }}
      >
        <Menu
          className="h-[100vh] max-h-[100vh] text-white overflow-hidden"
          menuItemStyles={{
            button: ({ level, active, disabled }) => {
              const backgroundColor = level === 0 ? "#141B24" : "#222e3d";
              return {
                backgroundColor: active ? "#ff9900" : backgroundColor,
                "&:hover": {
                  backgroundColor: active ? "#212c3a" : "#2c3a4d",
                },
              };
            },
          }}
        >
          <div className=" flex items-center justify-center my-10">
            <Image
              src="/primepicks_secondary_logo.png"
              alt="logo"
              height={150}
              width={150}
            />
          </div>

          {menuItems.map((item, index) => (
            <React.Fragment key={index}>
              {item.subMenuItems ? (
                <SubMenu label={item.label} icon={item.icon}>
                  {item.subMenuItems.map((subItem, subIndex) => (
                    <MenuItem
                      icon={subItem.icon}
                      key={subIndex}
                      active={selectedItem === subItem.link}
                      onClick={() => handleItemClick(subItem.link)}
                    >
                      {subItem.label}
                    </MenuItem>
                  ))}
                </SubMenu>
              ) : (
                <MenuItem
                  icon={item.icon}
                  active={item.link === selectedItem}
                  onClick={() => handleItemClick(item.link)}
                >
                  {item.label}
                </MenuItem>
              )}
            </React.Fragment>
          ))}
        </Menu>
      </Sidebar>
    </div>
  );
};

export default Side;
