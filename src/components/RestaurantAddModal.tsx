import { useEffect, useState } from "react"
import { Modal, Form, Input, Select, Rate, Checkbox } from "antd"
import type { City, CuisineType, Restaurant } from "../types"

interface RestaurantAddModalProps {
    open: boolean
    restaurant: Restaurant | null
    onCancel: () => void
    onSave: (updatedRestaurant: Restaurant) => void
}

export default function RestaurantAddModal({ open, restaurant, onCancel, onSave }: RestaurantAddModalProps) {
    const [form] = Form.useForm()
    const [cities, setCities] = useState<City[]>([]) // State to hold the list of cities for the city dropdown
    const [cuisineTypes, setCuisineTypes] = useState<CuisineType[]>([]) // State to hold the list of cuisine types for the cuisine type dropdown

    useEffect(() => {
        if (!open) return
        // Fetch cities and cuisine types when the modal opens
        fetch('/api/v1/cities/')
            .then(res => res.json())
            .then(data => setCities(data.results ?? data))
            .catch(error => console.error('Error fetching cities:', error))
            
        fetch('/api/v1/cuisine-types/')
            .then(res => res.json())
            .then(data => setCuisineTypes(data.results ?? data))
            .catch(error => console.error('Error fetching cuisine types:', error))
    }, [open])


    const handleFinish = (values: any) => {
        fetch(`/api/v1/restaurants/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json', // Ensure the server knows we expect JSON in response
                'Content-Type': 'application/json' // Specify the content type of the request body
            },
            body: JSON.stringify({
                name: values.name,
                rating: values.rating,
                was_visited: values.was_visited,
                city_id_input: values.city_id,
                cuisine_type_id_input: values.cuisine_type_id
            })
        })
        .then(res => res.json())
        .then(created => fetch(`/api/v1/restaurants/${created.id}/`, {
            headers: {
                'Accept': 'application/json'
            }
        })) // Fetch the newly created restaurant to get all its data, including related city and cuisine type objects
        .then(res => res.json())
        .then(newRestaurant => {
            onSave(newRestaurant)
            form.resetFields()
        })
    }

    return (
        <Modal
            title="Agregar Restaurante"
            open={open}
            onCancel={() => {
                form.resetFields()
                onCancel()
            }}
            onOk={() => form.submit()}
            okText="Guardar"
            cancelText="Cancelar"
        >
            <Form form={form} layout="vertical" onFinish={handleFinish}>
                <Form.Item name="name" label="Nombre" rules={[{ required: true, message: 'Por favor ingresa el nombre del restaurante' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="city_id" label="Ciudad" rules={[{ required: true, message: 'Por favor selecciona una ciudad' }]}>
                    <Select
                        options={cities.map(city => ({ label: `${city.name}, ${city.country.name}`, value: city.id }))}
                    />
                </Form.Item>
                <Form.Item name="cuisine_type_id" label="Tipo de Cocina" rules={[{ required: true, message: 'Por favor selecciona al menos un tipo de cocina' }]}>
                    <Select
                        mode="multiple"
                        options={cuisineTypes.map(cuisine => ({ label: cuisine.name, value: cuisine.id }))}
                    />
                </Form.Item>
                <Form.Item name="rating" label="Calificación">
                    <Rate />
                </Form.Item>
                <Form.Item name="was_visited" valuePropName="checked" label="¿Lo has visitado?">
                    <Checkbox />
                </Form.Item>
            </Form>
        </Modal>
    )
}