import axios from "axios";

const API_BASE_URL = "https://api.olamaps.io/places/v1";

export interface ReverseGeocodeResponse {
  results: Array<{
    formatted_address: string;
    address_components: Array<{
      types: string[];
      long_name: string;
      short_name: string;
    }>;
  }>;
  status: string;
}

export const reverseGeocode = async (
  lat: number,
  lng: number,
): Promise<{
  city: string;
  district: string;
  pincode: string;
  formattedAddress: string;
} | null> => {
  const apiKey = import.meta.env.VITE_OLA_MAP_TOKEN_API;
  if (!apiKey) return null;

  try {
    const response = await axios.get<ReverseGeocodeResponse>(
      `${API_BASE_URL}/reverse-geocode`,
      {
        params: {
          latlng: `${lat},${lng}`,
          api_key: apiKey,
        },
      },
    );

    if (response.data.status === "ok" && response.data.results.length > 0) {
      const result = response.data.results[0];
      const components = result.address_components;

      const findComponent = (type: string) =>
        components.find((c) => c.types.includes(type))?.long_name || "";

      return {
        city:
          findComponent("locality") ||
          findComponent("administrative_area_level_2"),
        district:
          findComponent("administrative_area_level_2") ||
          findComponent("administrative_area_level_1"),
        pincode: findComponent("postal_code"),
        formattedAddress: result.formatted_address,
      };
    }
    return null;
  } catch (error) {
    console.error("Reverse geocoding failed:", error);
    return null;
  }
};
