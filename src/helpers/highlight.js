export const highlight = (target, keyword) => {
  if (keyword && target.toLowerCase().indexOf(keyword) > -1) {
    const index = target.toLowerCase().indexOf(keyword);
    const matching = target.substring(index, index + keyword.length);
    return target.replace(
      matching,
      `<span class="highlight">${matching}</span>`
    );
  }
  return target;
};
