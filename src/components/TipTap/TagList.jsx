import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

// eslint-disable-next-line react/display-name
export default forwardRef((props, ref) => {
  const [selected, setSelected] = useState(0);

  const selectItem = (id) => {
    const item = props.items.find((item) => item.id === id);

    if (item) {
      props.command({ ...item });
    }
  };

  // const upHandler = () => {
  //   const index = props.items.findIndex((item) => item.id === selected);
  //   const newIndex = (index + props.items.length - 1) % props.items.length;
  //   setSelected(props.items[newIndex].id);
  // };

  // const downHandler = () => {
  //   const index = props.items.findIndex((item) => item.id === selected);
  //   const newIndex = (index + 1) % props.items.length;
  //   setSelected(props.items[newIndex].id);
  // };

  // const enterHandler = () => {
  //   selectItem(selected);
  // };

  useEffect(
    () => setSelected(props.items.length ? props.items[0].id : 0),
    [props.items]
  );

  // useImperativeHandle(ref, () => ({
  //   onKeyDown: ({ event }) => {
  //     if (event.key === "ArrowUp") {
  //       upHandler();
  //       return true;
  //     }

  //     if (event.key === "ArrowDown") {
  //       downHandler();
  //       return true;
  //     }

  //     if (event.key === "Enter") {
  //       enterHandler();
  //       return true;
  //     }

  //     return false;
  //   },
  // }));

  return (
    <div
      className={cn(
        "p-1 h-fit flex animate-in fade-in-15 duration-300",
        "overflow-auto"
      )}
    >
      {props.items.length ? (
        props.items.map(({ label, id }) => (
          <Button
            className={cn("text-xs p-1 px-2 h-fit", {
              selected: selected === id,
            })}
            key={id}
            onClick={() => selectItem(id)}
            type="button"
            variant="outline"
            size="sm"
          >
            {label}
          </Button>
        ))
      ) : (
        <div className="item">No result</div>
      )}
      {/* {props.items.length && props.items.length > 3 ? <span>...</span> : null} */}
    </div>
  );
});
