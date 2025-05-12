const CreateUserSchema = {
    $first_name : "john",
    $last_name : "doe",
    $email : "o1oYb@example.com",
    $password : "password",
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
export const Schemas = {
    CreateUserSchema,
    LoginUserSchema,
    CreateCategorySchema
}