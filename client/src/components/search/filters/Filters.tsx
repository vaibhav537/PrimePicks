import { sortingTypes } from "@/lib/utils/HelperClient";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import React, { useState } from "react";
import { FaStar } from "react-icons/fa";

const Filters = () => {
  const filterData = { brands: ["Apple", "Samsung", "Xiaomi"] };
  return (
    <div className="px-4 text-sm text-pp-dark flex flex-col gap-5">
      <div className="">
        <h4 className="font-semibold">Item Condition</h4>
        <ul>
          <li className="link-hover">New</li>
          <li className="link-hover">Renewed</li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold">Customer Review</h4>
        {[4, 3, 2, 1].map((reviewIndex) => {
          return (
            <div
              key={reviewIndex}
              className="flex items-center gap-1 cursor-pointer hover:text-pp-primary"
            >
              <div className="flex cursor-pointer">
                {Array.from(Array(reviewIndex)).map((s) => (
                  <FaStar className="text-pp-primary" key={s} />
                ))}
                {Array.from(Array(5 - reviewIndex)).map((s) => (
                  <FaStar className="text-gray-400" key={s} />
                ))}
              </div>
              <span>& up </span>
            </div>
          );
        })}
      </div>
      <div>
        <h4 className="font-semibold">Brand</h4>
        <ul>
          {filterData.brands.map((brand) => (
            <li key={brand} className="link-hover">
              {brand}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="font-semibold">Price</h4>
        <ul>
          <li className="link-hover">Under 500</li>
          <li className="link-hover">500-1000</li>
          <li className="link-hover">1500-2000</li>
          <li className="link-hover">Above 2000</li>
        </ul>
        <div className="my-2 flex gap-2">
          <input
            type="text"
            placeholder="MIN"
            className="w-12 pl-2 border border-black rounded "
          />
          <input
            type="text"
            placeholder="MAX"
            className="w-12 pl-2 border border-black rounded "
          />
          <button className="bg-pp-secondary px-3 py-1 rounded text-white">
            GO
          </button>
        </div>
      </div>
      <div>
        <h4 className="font-semibold"> Sort By</h4>
        <MyListBox />
      </div>
    </div>
  );
};

function MyListBox() {
  const [selectedSortingType, setSelectedSortingType] = useState(
    sortingTypes[0]
  );

  return (
    <Listbox value={selectedSortingType} onChange={setSelectedSortingType}>
      <ListboxButton className="bg-gray-200 p-2 rounded w-max">
        {selectedSortingType.name}
      </ListboxButton>
      <ListboxOptions
        anchor="bottom"
        transition
        className="origin-top ml-3 text-sm transition duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
      >
        {sortingTypes.map((sType) => (
          <ListboxOption
            key={sType.id}
            value={sType}
            className="data-[focus]:bg-blue-100 bg-gray-200 p-2 mt-1 w-max"
          >
            {sType.name}
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  );
}

export default Filters;
