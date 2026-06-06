import * as itemFns from "../functions/item.queries.ts";

type AddItemProps = {
  selectedDate: () => Temporal.PlainDate;
};
export const AddItem = (props: AddItemProps) => {
  const addItem = async () => {
    console.log("pressed the button..");
    return await itemFns.insert(props.selectedDate().toString());
  };

  return <button class="bg-red p-4" type="button" onClick={addItem}>Add randon item</button>;
};
