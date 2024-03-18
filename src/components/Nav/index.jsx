"use client";

import React, { useState } from "react";
import { Input } from "../ui/input";
import { useMotionValueEvent, useScroll } from "framer-motion";
import clsx from "clsx";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";
import { MdOutlineSort } from "react-icons/md";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import ArgumentForm from "../Forms/ArgumentForm";
import useConfirm from "@/hooks/useConfirm";
import DarkModeToggle from "../DarkModeToggle";
import UserNav from "../UserNav";

const Nav = () => {
  const [open, setOpen] = useState(false);
  const [scrollState, setScrollState] = useState(false);
  const [ConfirmationDialog, confirm] = useConfirm(
    "Are you sure?",
    "This action cannot be undone",
    "Close"
  );
  const { scrollYProgress } = useScroll();

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setScrollState(latest > 0);
  });

  const toggleDialog = async (value) => {
    if (!value) {
      const close = await confirm();
      if (close) {
        setOpen(false);
      }
    } else {
      setOpen(true);
    }
  };

  return (
    <nav
      className={clsx(
        "sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex py-3 items-center transition-all",
        scrollState && "shadow-lg"
      )}
    >
      <Link href="/" className="w-fit sm:w-2/12 text-right p-2">
        <MdOutlineSort className="sm:hidden ml-2" size={24} />
        <h1 className="hidden sm:block">Debate</h1>
      </Link>
      <Input
        placeholder="Search"
        className="w-full sm:w-5/12 bg-transparent focus-visible:ring-transparent"
      />
      <Dialog open={open} onOpenChange={toggleDialog}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="ml-2 mr-2 sm:mr-0 space-x-1 bg-transparent"
          >
            <FaPlus />
            <span className="font-normal hidden sm:inline-block">Create</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="lg:min-w-[600px]">
          <ArgumentForm closeDialog={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
      <div className="sm:flex-1 flex justify-end items-center gap-3 mr-3">
        <DarkModeToggle />
        <UserNav />
      </div>
      <ConfirmationDialog />
    </nav>
  );
};

export default Nav;
