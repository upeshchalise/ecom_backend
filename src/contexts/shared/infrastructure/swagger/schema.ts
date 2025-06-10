const CreateUserSchema = {
    $first_name : "john",
    $last_name : "doe",
    $email : "o1oYb@example.com",
    $password : "password",
    $address : "123 Main St",
    $image : "https://example.com/image.png",
    $phone : "1234567890",
}
const UpdateUserSchema = {
    $first_name : "john",
    $last_name : "doe",
    $address : "123 Main St",
    $image : "https://example.com/image.png",
    $phone : "1234567890",
}

const LoginUserSchema = {
    $email : "o1oYb@example.com",
    $password : "password",
}

const CreateCategorySchema = {
    $name : "Electronics",
}

const CreateProductSchema = {
    $name : "Electronics",
    $price : "Electronics",
    $description : "Electronics",
    $category_id : ["CD89F481-5369-4778-9507-CFC7039F76B7", "8615D8B8-2E57-4D23-AE1E-F7A1E94C8D0A"]
}
export const Schemas = {
    CreateUserSchema,
    UpdateUserSchema,
    LoginUserSchema,
    CreateCategorySchema,
    CreateProductSchema
}