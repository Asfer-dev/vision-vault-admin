"use client";

import PageLayout from "@app/PageLayout";
import { IconDelete, IconEdit } from "@lib/icons";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MoonLoader } from "react-spinners";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const fetchProducts = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/product", { cache: "no-store" });
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const getProducts = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/product", { cache: "no-store" });
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();

    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/category");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategories();
  }, []);

  const deleteProduct = async (id) => {
    const hasConfirmed = confirm(
      "Are you sure you want to delete this product?"
    );
    if (hasConfirmed) {
      try {
        const response = await fetch("/api/product/" + id, {
          method: "DELETE",
        });
        if (response.ok) {
          alert("Product successfully deleted.");
          setProducts((prev) => {
            return prev.filter((product) => product._id !== id);
          });
        } else {
          alert("failed to delete product");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <PageLayout>
      <h1 className="page-heading">Products</h1>
      <Link href={"/products/new"} className="btn-primary">
        Add new product
      </Link>

      {/* FILTER */}
      <div className="mt-4">
        <label>Filter:</label>
        <div className="flex gap-2 sm:w-1/2">
          <div className="flex items-center gap-1 w-full">
            <label>Category:</label>
            <select
              className="mb-0"
              onChange={async (e) => {
                const unfilProducts = await getProducts();
                if (e.target.value === "") {
                  setProducts(unfilProducts);
                } else {
                  const filteredProducts = unfilProducts.filter(
                    (product) => product.category?._id === e.target.value
                  );
                  setProducts(filteredProducts);
                }
              }}
            >
              <option value={""}>No filter</option>
              {categories?.map((cat) => (
                <option value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-1 w-full">
            <label>Gender:</label>
            <select
              onChange={async (e) => {
                const unfilProducts = await getProducts();
                if (e.target.value === "") {
                  setProducts(unfilProducts);
                } else {
                  const filteredProducts = unfilProducts.filter((product) => {
                    const gender = product.properties?.find(
                      (prop) => prop.name === "Gender"
                    ).value;
                    if (e.target.value.includes("only")) {
                      return (
                        gender.toLowerCase() === e.target.value.split(" ")[0]
                      );
                    } else {
                      return (
                        gender.toLowerCase() === e.target.value ||
                        gender === "Unisex"
                      );
                    }
                  });
                  setProducts(filteredProducts);
                }
              }}
              className="mb-0"
            >
              <option value={""}>All</option>
              <option value={"male"}>Male</option>
              <option value={"male only"}>Male only</option>
              <option value={"female"}>Female</option>
              <option value={"female only"}>Female only</option>
              <option value={"unisex"}>Unisex</option>
            </select>
          </div>
        </div>
      </div>

      {/* NUMBER INFO */}
      <div className="m-2 text-neutral-700">
        <b>{products.length}</b> products found
      </div>

      {/* PRODUCTS TABLE */}
      {loading ? (
        <div className="my-8 flex flex-col gap-4 items-center">
          <MoonLoader color="#404040" />
          <p className="text-neutral-700 font-medium">Loading Products</p>
        </div>
      ) : (
        <>
          <table className="basic mt-2">
            <thead>
              <tr>
                <td>Product Name</td>
                <td>Category</td>
                {/* <td>Actions</td> */}
              </tr>
            </thead>
            <tbody>
              {products?.map((product) => (
                <tr key={product._id}>
                  <td>{product.title}</td>
                  <td>{product.category?.name}</td>
                  <td className="flex flex-col sm:flex-row gap-2 justify-end">
                    <Link
                      className="btn-edit"
                      href={"/products/edit/" + product._id}
                    >
                      <IconEdit clas={"w-4 h-4"} />
                      <span>Edit</span>
                    </Link>
                    <button
                      className="btn-delete"
                      onClick={() => deleteProduct(product._id)}
                    >
                      <IconDelete clas={"w-4 h-4"} />
                      <span>Delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </PageLayout>
  );
}
