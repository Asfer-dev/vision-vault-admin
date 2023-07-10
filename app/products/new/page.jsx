"use client";

import PageLayout from "@app/PageLayout";
import Form from "@components/Form";
import { useRouter } from "next/navigation";
import React from "react";
import { useState, useEffect } from "react";

export default function NewProduct() {
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
  const createProduct = async () => {
    setSubmitting(true);

    try {
      const response = await fetch("/api/product/new", {
        method: "POST",
        body: JSON.stringify(product),
      });

      if (response.ok) {
        router.push("/products");
      } else {
        alert("Product could not be created");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <PageLayout>
      <h1 className="page-heading">New Product</h1>
      <Form
        product={product}
        setProduct={setProduct}
        handleSubmit={createProduct}
        submitting={submitting}
      />
    </PageLayout>
  );
}
