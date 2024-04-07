"use client";
import { useEffect, useState } from "react";

const getHash = () =>
  typeof window !== "undefined"
    ? decodeURIComponent(window.location.hash.replace("#", ""))
    : undefined;

const useHash = ({ checkHash = () => true }) => {
  useEffect(() => {
    const handleHashChange = () => {
      checkHash(getHash());
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [checkHash]);
};

export default useHash;
