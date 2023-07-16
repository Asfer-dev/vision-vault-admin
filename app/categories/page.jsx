"use client";

import PageLayout from "@app/PageLayout";
import { IconDelete, IconEdit } from "@lib/icons";
import { useEffect, useState } from "react";
import { MoonLoader } from "react-spinners";

export const dynamic = "force-dynamic";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/category", { cache: "no-cache" });
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const [category, setCategory] = useState({
    name: "",
    parent: null,
    properties: [],
  });
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const createCategory = async () => {
    setSubmitting(true);
    try {
      const newProperties = category.properties.map((property) => ({
        ...property,
        value: property.value.split(","),
      }));
      const response = await fetch("/api/category/new", {
        method: "POST",
        body: JSON.stringify({
          ...category,
          properties: newProperties,
        }),
      });

      if (response.ok) {
        setCategory({
          name: "",
          parent: null,
          properties: [],
        });
        fetchCategories();
      } else {
        alert("An error occurred while creating new category");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  const enableEdit = async (id) => {
    setIsEditing(true);
    try {
      const response = await fetch("/api/category/" + id, {
        cache: "no-cache",
      });
      const data = await response.json();
      setCategory(data);
    } catch (error) {
      console.log(error);
    }
  };

  const updateCategory = async () => {
    setSubmitting(true);
    try {
      const newProperties = category.properties.map((property) => {
        // console.log(typeof property.value);
        if (typeof property.value === "object") {
          return property;
        } else
          return {
            ...property,
            value: property.value.split(","),
          };
      });
      const response = await fetch("/api/category/" + category._id, {
        method: "PATCH",
        body: JSON.stringify({
          ...category,
          properties: newProperties,
        }),
      });

      if (response.ok) {
        alert("Category successfully edited");
        setCategory({
          name: "",
          parent: null,
          properties: [],
        });
        fetchCategories();
      } else alert("something went wrong in editing the category");
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
      setIsEditing(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) updateCategory();
    else createCategory();
  };

  const handlePropertyNameChange = (newName, index) => {
    setCategory((prev) => {
      const properties = [...prev.properties];
      properties[index].name = newName;
      const updated = { ...prev, properties: properties };
      return updated;
    });
  };
  const handlePropertyValueChange = (newvalue, index) => {
    setCategory((prev) => {
      const properties = [...prev.properties];
      properties[index].value = newvalue;
      const updated = { ...prev, properties: properties };
      return updated;
    });
  };

  const setProperties = (newProperties) => {
    setCategory({
      ...category,
      properties: newProperties,
    });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const deleteCategory = async (id) => {
    const hasConfirmed = confirm(
      "Are you sure you want to delete this category?"
    );
    if (hasConfirmed) {
      try {
        const response = await fetch("/api/category/" + id, {
          method: "DELETE",
        });
        if (response.ok) {
          alert("Category successfully deleted.");
          setCategories((prev) => {
            return prev.filter((category) => category._id !== id);
          });
        } else {
          alert("Failed to delete category");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <PageLayout>
      <h1 className="page-heading">Categories</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="name">{isEditing ? "Edit" : "New"} Category Name</label>
        <div className="flex flex-col sm:flex-row gap-1">
          <input
            placeholder="Category name"
            id="name"
            type="text"
            onChange={(e) => setCategory({ ...category, name: e.target.value })}
            value={category.name}
          />
          <select
            id=""
            onChange={(e) =>
              setCategory({ ...category, parent: e.target.value })
            }
            value={category.parent}
          >
            <option value="">Select Parent</option>
            {categories.length > 0 &&
              categories.map((category) => (
                <option value={category._id}>{category.name}</option>
              ))}
          </select>
        </div>
        <div className="mb-2">
          <label htmlFor="">Properties</label>
          <br />
          {category.properties.length > 0 &&
            category.properties.map((property, index) => (
              <div className="flex gap-1">
                <input
                  placeholder="name"
                  type="text"
                  onChange={(e) =>
                    handlePropertyNameChange(e.target.value, index)
                  }
                  value={property.name}
                />
                <input
                  placeholder="value"
                  type="text"
                  onChange={(e) =>
                    handlePropertyValueChange(e.target.value, index)
                  }
                  value={property.value}
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    const updatedProperties = category.properties.filter(
                      (property, i) => i !== index
                    );
                    setProperties(updatedProperties);
                  }}
                  className="btn-red mb-2"
                >
                  Remove
                </button>
              </div>
            ))}
          <button
            onClick={(e) => {
              e.preventDefault();
              setProperties([...category.properties, { name: "", value: "" }]);
            }}
            className="btn-secondary"
          >
            Add New
          </button>
        </div>
        <button className="btn-primary" type="submit">
          {submitting ? "Save..." : "Save"}
        </button>
      </form>

      {loading ? (
        <div className="my-8 flex flex-col gap-4 items-center">
          <MoonLoader color="#404040" />
          <p className="text-neutral-700 font-medium">Loading Categories</p>
        </div>
      ) : (
        <table className="basic mt-4">
          <thead>
            <td>Category Name</td>
            <td>Parent</td>
            <td>Actions</td>
          </thead>
          <tbody>
            {categories.length > 0 &&
              categories.map((category) => (
                <tr>
                  <td>{category.name}</td>
                  <td>{category.parent?.name}</td>
                  <td className="flex flex-col md:flex-row gap-2 justify-end">
                    <button
                      onClick={() => enableEdit(category._id)}
                      className="btn-edit"
                    >
                      <IconEdit clas="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => deleteCategory(category._id)}
                      className="btn-delete"
                    >
                      <IconDelete clas="w-4 h-4" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </PageLayout>
  );
}
