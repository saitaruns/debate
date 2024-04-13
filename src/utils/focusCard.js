const handleFocusCard = (hash) => {
  const el = document.getElementById(hash);
  el?.scrollIntoView({
    block: "center",
    inline: "center",
    behavior: "smooth",
  });
  el?.animate(
    [
      { backgroundColor: "hsl(var(--primary) / 0.1)" },
      { backgroundColor: "initial" },
    ],
    { duration: 2000, iterations: 1 }
  );
};

export { handleFocusCard };
