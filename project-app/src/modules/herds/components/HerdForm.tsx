import { Form } from "../../../shared/components/Forms/Forms/Form";
import { useModal } from "../../../shared/context/ModalContext";

interface CreateHerdFormData {
  name: string;
  type: string;
  quantity: number;
}

export default function HerdForm() {
  const { closeModal } = useModal();

  function handleSubmit(data: CreateHerdFormData) {
    console.log("Novo rebanho:", data);
    closeModal();
  }

  return (
    <Form<CreateHerdFormData>
      initialValues={{
        name: "",
        type: "",
        quantity: 0,
      }}
      fields={[
        { name: "name", label: "Nome", required: true },
        { name: "type", label: "Tipo", required: true },
        {
          name: "quantity",
          label: "Quantidade",
          type: "number",
          required: true,
        },
      ]}
      onSubmit={handleSubmit}
      onCancel={closeModal}
    />
  );
}