"use client";

import { IconClose } from "@lib/icons";
import { useEffect, useState } from "react";
import { ReactSortable } from "react-sortablejs";

export default function Form({
  product,
  setProduct,
  handleSubmit,
  submitting,
}) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
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

  const [props, setProps] = useState([]);
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoViewVisible, setPhotoViewVisible] = useState(false);
  const [viewingPhoto, setViewingPhoto] = useState("");

  useEffect(() => {
    const totalProps = getAllProps(product?.category);
    setProps(totalProps);
  }, [categories, product]);

  const getAllProps = (categ) => {
    let category = categories?.find((cat) => cat._id === categ?._id);
    let totalProps = [];
    if (category) {
      totalProps.push(...category.properties);
      while (category.parent?._id) {
        totalProps.push(...category.parent.properties);
        category = category.parent;
      }
    }
    return totalProps;
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      {/* TITLE */}
      <label htmlFor="title">Title: </label>
      <input
        id="title"
        placeholder="Title"
        type="text"
        onChange={(e) => setProduct({ ...product, title: e.target.value })}
        value={product.title}
      />

      {/* CATEGORY */}
      <label htmlFor="category">Category:</label>
      <select
        id="category"
        onChange={(e) => {
          const selCategory = categories.find(
            (cat) => cat._id === e.target.value
          );

          const allProps = getAllProps(selCategory);
          setProps(allProps);

          const catProps = allProps?.map((prop) => ({
            ...prop,
            value: "",
          }));

          setProduct({
            ...product,
            properties: catProps,
            category: selCategory,
          });
        }}
        value={product.category?._id}
      >
        <option value="">No category selected</option>
        {categories?.map((cat) => (
          <option value={cat._id}>{cat.name}</option>
        ))}
      </select>

      {/* PROPERTIES */}
      {props?.length > 0 && (
        <>
          <label htmlFor="">Properties:</label>
          <div className="my-2">
            {props?.map((property, index) => {
              const propValue = product.properties?.find(
                (prop) => prop.name === property.name
              )?.value;
              return (
                <div className="flex gap-1 items-center" key={index}>
                  <p className="mb-2">{property.name}</p>
                  <select
                    onChange={(e) => {
                      const newProperties = product.properties.map((prop) => {
                        if (prop.name === property.name) {
                          return { ...prop, value: e.target.value };
                        } else {
                          return prop;
                        }
                      });
                      setProduct({ ...product, properties: newProperties });
                    }}
                    value={propValue}
                  >
                    {property.value?.map((val) => (
                      <option value={val}>{val}</option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* PHOTOS */}
      <label htmlFor="">Photos: </label>

      {/* ENLARGED PHOTO VIEW */}
      {photoViewVisible && (
        <div className="fixed inset-0 flex flex-col items-center gap-8 text-white z-20">
          <div
            onClick={() => setPhotoViewVisible(false)}
            className="bg-black/80 absolute inset-0"
          ></div>
          <div className="flex justify-end w-screen p-4 px-8">
            <button className="z-20" onClick={() => setPhotoViewVisible(false)}>
              <IconClose />
            </button>
          </div>
          <h3 className="z-20 px-4">
            URL:{" "}
            <a
              className="hover:text-gray-200"
              href={viewingPhoto}
              target="_blank"
            >
              {viewingPhoto}
            </a>
          </h3>
          <div className="overflow-auto z-20 px-4 pb-4">
            <img className="shadow-lg" src={viewingPhoto} />
          </div>
        </div>
      )}

      {!product.photos.length && (
        <p className="mt-4 text-neutral-600">No photos added yet</p>
      )}
      {/* ADDED PHOTOS LIST */}
      <ReactSortable
        className="flex flex-wrap gap-2 my-4"
        list={product.photos}
        setList={(photoList) => setProduct({ ...product, photos: photoList })}
      >
        {product.photos.length > 0 &&
          product.photos.map((photoUrl) => (
            <div className="relative">
              {/* REMOVE BUTTON */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  const updatedPhotos = product.photos.filter(
                    (photo) => photo !== photoUrl
                  );
                  setProduct({ ...product, photos: updatedPhotos });
                }}
                className="absolute -right-1 -top-1 z-10 bg-red-400 text-white rounded-full"
              >
                <IconClose clas="w-4 h-4" />
              </button>
              {/* PHOTO */}
              <img
                onClick={() => {
                  setPhotoViewVisible(true);
                  setViewingPhoto(photoUrl);
                }}
                className="h-28 cursor-pointer bg-white p-4 border border-neutral-200 rounded-sm hover:opacity-90"
                src={photoUrl}
                alt=""
              />
            </div>
          ))}
      </ReactSortable>

      {/* PHOTO INPUT */}
      <div className="flex gap-1">
        <input
          placeholder="Enter photo url..."
          type="text"
          onChange={(e) => setPhotoUrl(e.target.value)}
          value={photoUrl}
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            const updatedPhotos = product.photos;
            updatedPhotos.push(photoUrl);
            setProduct({ ...product, photos: updatedPhotos });
            setPhotoUrl("");
          }}
          className="btn-secondary mb-2"
        >
          Add
        </button>
      </div>

      {/* DESCRIPTION */}
      <label htmlFor="description">Description: </label>
      <textarea
        placeholder="Description"
        id="description"
        onChange={(e) =>
          setProduct({ ...product, description: e.target.value })
        }
        value={product.description}
      />

      {/* PRICE */}
      <label htmlFor="price">Price: </label>
      <input
        id="price"
        placeholder="Price"
        type="number"
        onChange={(e) => setProduct({ ...product, price: e.target.value })}
        value={product.price}
      />

      {/* SUBMIT BUTTON */}
      <button className="btn-primary" type="submit">
        {submitting ? "Save..." : "Save"}
      </button>
    </form>
  );
}
