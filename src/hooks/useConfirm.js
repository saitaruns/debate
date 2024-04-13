"use client";

import { useContext, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AuthContext } from "@/components/AuthContext";

const useConfirm = () => {
  const [message, setMessage] = useState({
    title: "Are you sure?",
    message: "This cannot be undone. Are you sure you want to continue?",
    actionBtnMessage: "Confirm",
  });
  const user = useContext(AuthContext);
  const [promise, setPromise] = useState(null);

  const confirm = (messageData) => {
    setMessage(messageData);
    return new Promise((resolve) => {
      setPromise({ resolve });
    });
  };

  const handleClose = () => {
    setPromise(null);
  };

  const handleConfirm = () => {
    promise?.resolve(true);
    handleClose();
  };

  const handleCancel = () => {
    promise?.resolve(false);
    handleClose();
  };

  if (!user) return [() => null, () => true];

  const ConfirmationDialog = () => (
    <AlertDialog open={promise !== null}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{message.title}</AlertDialogTitle>
          <AlertDialogDescription>{message.message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            {message.actionBtnMessage}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
  return [ConfirmationDialog, confirm];
};

export default useConfirm;
