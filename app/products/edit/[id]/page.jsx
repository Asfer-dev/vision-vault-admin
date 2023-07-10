"use client";

import PageLayout from "@app/PageLayout";
import Form from "@components/Form";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditProduct() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState({
    title: "",
    category: null,
    properties: [],
    photos: [],
    description: "",
    price: null,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch("/api/product/" + id);
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProduct();
  }, []);

  const editProduct = async () => {
    setSubmitting(true);

    try {
      const response = await fetch("/api/product/" + id, {
        method: "PATCH",
        body: JSON.stringify(product),
      });

      if (response.ok) {
        router.push("/products");
      } else {
        alert("An error occurred while updating the product");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <PageLayout>
      <h1 className="page-heading">Edit Product</h1>
      <Form
        product={product}
        setProduct={setProduct}
        handleSubmit={editProduct}
        submitting={submitting}
      />
    </PageLayout>
  );
}
