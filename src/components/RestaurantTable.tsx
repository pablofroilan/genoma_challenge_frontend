import { useState, useEffect, useMemo } from 'react'
import { Flex, Table, Rate, Checkbox, Space, Button, Popconfirm } from 'antd'
import RestaurantEditModal from './RestaurantEditModal.tsx'
import RestaurantAddModal from './RestaurantAddModal.tsx'
import type { CuisineType, Restaurant } from '../types'



export default function RestaurantTable() {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]) // State to hold the list of restaurants
    const [cuisineFilter, setCuisineFilter] = useState<number | null>(null) // State to hold the currently selected cuisine filter (by cuisine type ID)
    const [editModalOpen, setEditModalOpen] = useState(false) // State to control the visibility of the edit modal
    const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null) // State to hold the restaurant currently being edited  
    const [addModalOpen, setAddModalOpen] = useState(false) // State to control the visibility of the add modal
    const [total, setTotal] = useState(0) // State to hold the total number of restaurants, used for pagination
    const [currentPage, setCurrentPage] = useState(1) // State to hold the current page number for pagination

    // Function to fetch restaurant data from the API, accepts an page number and cuisine filter
    const fetchRestaurants = (page: number = 1, cuisine?: number | null) => {
        // Construct the API URL based on the cuisine filter, if cuisineFilter is set, include it as a query parameter
        let url = `/api/v1/restaurants/?page=${page}`
        if (cuisine) {
            url += `&cuisine_type_id=${cuisine}`
        }
        
        fetch(url, {
            headers: { 'Accept': 'application/json' }
        })
        .then(res => res.json())
        .then(data => {
            setRestaurants(data.results ?? data)
            setTotal(data.count ?? 0) // Update total count for pagination
        })
        .catch(error => console.error('Error fetching restaurants:', error))
    }

    // Fetch restaurant data on component mount
    useEffect(() => {
        fetchRestaurants(currentPage, cuisineFilter)
    }, [currentPage, cuisineFilter]) // Re-run effect when currentPage or cuisineFilter changes

    // Function to handle opening the edit modal and populating the form with the selected restaurant's data
    const handleEdit = (restaurant: Restaurant) => {
        setEditingRestaurant(restaurant)
        setEditModalOpen(true)
    }

    // Function to handle saving the updated restaurant data from the modal
    const handleEditSave = (updatedRestaurant: Restaurant) => {
        // Update the restaurant in the state with the new data
        setRestaurants(prev => prev.map(r => r.id === updatedRestaurant.id ? updatedRestaurant : r))
        setEditModalOpen(false)
    }

    // Function to handle adding a new restaurant, simply opens the add modal with no restaurant data
    const handleAdd = () => {
        setAddModalOpen(true)
    }

    // Function to handle saving a new restaurant from the add modal
    const handleAddSave = (newRestaurant: Restaurant) => {
        // Add the new restaurant to the state
        setRestaurants(prev => [...prev, newRestaurant])
        setAddModalOpen(false)
    }

    

    // Function to handle deleting a restaurant
    const handleDelete = (id: number) => {
        fetch(`/api/v1/restaurants/${id}/`, {
            method: 'DELETE',
            headers: { 'Accept': 'application/json' }
        })
        .then(res => {
            if (res.ok) { // If the delete request was successful, remove the restaurant from the state
                setRestaurants(prev => prev.filter(r => r.id !== id))
            } else {
                console.error('Error deleting restaurant:', res.statusText)
            }
        })
    }

    // Define columns for the table
    const columns = useMemo(() => [
        {
            title: 'Nombre',
            dataIndex: 'name',
            key: 'name',
            sorter: (a: Restaurant, b: Restaurant) => a.name.localeCompare(b.name)
        },
        {
            title: 'Ciudad',
            dataIndex: ['city_id', 'name'],
            key: 'city',
            sorter: (a: Restaurant, b: Restaurant) => a.city_id.name.localeCompare(b.city_id.name)
        },
        {
            title: 'País',
            dataIndex: ['city_id', 'country', 'name'],
            key: 'country',
            sorter: (a: Restaurant, b: Restaurant) => a.city_id.country.name.localeCompare(b.city_id.country.name),
            filters: [...new Set(restaurants.map(r => r.city_id.country.name))].map(country => ({ text: country, value: country })),
            onFilter: (value: any, record: Restaurant) => record.city_id.country.name === value
        },
        {
            title: 'Tipo de Cocina',
            dataIndex: 'cuisine_type_id',
            key: 'cuisine',
            sorter: (a: Restaurant, b: Restaurant) => {
                const aCuisine = a.cuisine_type_id.map(c => c.name).join(', ')
                const bCuisine = b.cuisine_type_id.map(c => c.name).join(', ')
                return aCuisine.localeCompare(bCuisine)
            },
            // Filter handled by the API, so we just need to provide the filter options based on the available cuisine types in the current restaurant data
            filters: Object.values(
                restaurants
                .flatMap(r => r.cuisine_type_id) // Get all cuisine types from all restaurants
                .reduce((acc, cuisine) => ({ ...acc, [cuisine.id]: cuisine }), {} as Record<number, CuisineType>) // Create a unique set of cuisine types by ID
            ).map(c => ({ text: c.name, value: c.id })),
            render: (cuisines: CuisineType[]) => cuisines.map(c => c.name).join(', ')
        },
        {
            title: 'Calificación',
            dataIndex: 'rating',
            key: 'rating',
            sorter: (a: Restaurant, b: Restaurant) => (a.rating ?? 0) - (b.rating ?? 0),
            render: (rating: number | null) => <Rate disabled value={rating ?? 0}/>   
        },
        {
            title: 'Visitado',
            dataIndex: 'was_visited',
            key: 'visited',
            sorter: (a: Restaurant, b: Restaurant) => (a.was_visited === b.was_visited ? 0 : a.was_visited ? -1 : 1),
            filters: [
                { text: 'Sí', value: true },
                { text: 'No', value: false }
            ],
            onFilter: (value: any, record: Restaurant) => record.was_visited === value,
            render: (visited: boolean) => <Checkbox checked={visited} disabled />
        },
        {
            title: 'Acciones',
            key: 'actions',
            render: (_: any, record: Restaurant) => (
                <Space>
                    <Button type="link" onClick={() => handleEdit(record)}>Editar</Button>
                    <Popconfirm
                        title={`¿Estás seguro de que quieres eliminar el restaurante: ${record.name}?`}
                        description="Esta acción no se puede deshacer."
                        onConfirm={() => handleDelete(record.id)}
                        okText="Sí"
                        cancelText="No"
                    >
                        <Button type="link" danger>Eliminar</Button>
                    </Popconfirm>
                </Space>
            )
        }
    ], [restaurants])

    return (
        <div>
            <Flex justify='flex-end' align='flex-start' style={{ marginBottom: 16, marginRight: 16 }}>
                <Button type="primary" onClick={handleAdd}>
                    Agregar Restaurante
                </Button>
            </Flex>
            <Flex justify='center' align='flex-start'>
                <Table 
                    dataSource={restaurants} 
                    columns={columns} 
                    rowKey="id" 
                    pagination={{
                        current: currentPage,
                        pageSize: 10,
                        total: total,
                    }}
                    onChange={
                        (pagination, filters) => {
                            const cuisine = filters.cuisine?.[0]
                            const auxCuisine = cuisine ? Number(cuisine) : null
                            if (auxCuisine !== cuisineFilter) {
                                setCuisineFilter(cuisine ? Number(cuisine) : null)
                                setCurrentPage(cuisine !== cuisineFilter ? 1 : pagination.current ?? 1) // Update current page when pagination changes
                            } else {
                                setCurrentPage(pagination.current ?? 1) // Update current page when pagination changes
                            }
                        }
                    }/>
            </Flex>
            <RestaurantEditModal
                open={editModalOpen}
                restaurant={editingRestaurant}
                onSave={handleEditSave}
                onCancel={() => setEditModalOpen(false)}
            />
            <RestaurantAddModal
                open={addModalOpen}
                restaurant={null}
                onCancel={() => setAddModalOpen(false)}
                onSave={handleAddSave}
            />
        </div>
    )
}