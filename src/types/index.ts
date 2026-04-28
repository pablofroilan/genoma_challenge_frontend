export interface Country {
    id: number
    name: string
}

export interface City {
    id: number
    name: string
    country: Country
}

export interface CuisineType {
    id: number
    name: string
}

export interface Restaurant {
    id: number
    name: string
    rating: number | null
    was_visited: boolean
    city_id: City
    cuisine_type_id: CuisineType[]
}