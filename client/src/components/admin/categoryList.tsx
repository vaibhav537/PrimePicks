import React from "react";
type Category = {
  id: number;
  name: string;
};
type CategoryListProps = {
  categories: Category[]; 
};

const CategoryList: React.FC<CategoryListProps> = ({ categories }) => {
  return (
    <div>
      <h2>All Categories</h2>
      {categories.length > 0 ? (
        <ul>
          {categories.map((category) => (
            <li key={category.name}>{category.name}</li> 
          ))}
        </ul>
      ) : (
        <p>No categories available.</p>
      )}
    </div>
  );
};

export default CategoryList;
