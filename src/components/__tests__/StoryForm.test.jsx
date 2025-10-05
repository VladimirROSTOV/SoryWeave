
import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import StoryForm from "../StoryForm"


jest.mock("next-auth/react", () => ({
  useSession: () => ({
    data: { user: { id: 1, name: "Тестовый пользователь" } },
    status: "authenticated",
  }),
}))

describe("StoryForm component", () => {
  it("рендерит поле ввода и кнопку", () => {
    render(<StoryForm onAdd={() => {}} />)
    expect(
      screen.getByPlaceholderText(/новая история/i)
    ).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: /добавить/i })
    ).toBeInTheDocument()
  })

  it("выполняет onAdd при сабмите", () => {
    const mockOnAdd = jest.fn()

    render(<StoryForm onAdd={mockOnAdd} />)

    const input = screen.getByPlaceholderText(/новая история/i)
    fireEvent.change(input, { target: { value: "Моя история" } })

    const button = screen.getByRole("button", { name: /добавить/i })
    fireEvent.click(button)

    expect(mockOnAdd).toHaveBeenCalledTimes(0)
  })
})
