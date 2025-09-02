function useScrollBottom() {
    
  const scrollToBottom = () => {
    if (window !== undefined) {
      window.document.scrollingElement?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  return scrollToBottom;
}

export default useScrollBottom;
