export const TodoItem = (props: { item: { title: string } }) => {
  return <li>{props.item.title}</li>;
};
