"use client";

import PageLayout from "@app/PageLayout";
import { IconDelete, IconEdit } from "@lib/icons";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MoonLoader } from "react-spinners";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      try {
        const response = await fetch("/api/product");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
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
      {loading ? (
        <div className="my-8 flex flex-col gap-4 items-center">
          <MoonLoader color="#404040" />
          <p className="text-neutral-700 font-medium">Loading Products</p>
        </div>
      ) : (
        <table className="basic mt-2">
          <thead>
            <tr>
              <td>Product Name</td>
              {/* <td>Actions</td> */}
            </tr>
          </thead>
          <tbody>
            {products?.map((product) => (
              <tr key={product._id}>
                <td>{product.title}</td>
                <td className="flex gap-2 justify-end">
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
      )}
    </PageLayout>
  );
}
