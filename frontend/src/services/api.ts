import { LoadSearchRequest, LoadSearchResponse, SearchCriteria } from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5244';

export class TruckStopApiService {
  /**
   * Search for loads using the TruckStop API
   */
  static async searchLoads(request: LoadSearchRequest): Promise<LoadSearchResponse> {
    // Transform the request to match backend expectations
    const transformedRequest = {
      ...request,
      criteria: this.transformCriteria(request.criteria),
    };

    const response = await fetch(`${API_BASE_URL}/api/truckstop/load-search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transformedRequest),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data: LoadSearchResponse = await response.json();

    if (data.hasError) {
      throw new Error(data.errorMessage || 'Unknown API error');
    }

    return data;
  }

  /**
   * Transform search criteria to match backend API expectations
   */
  private static transformCriteria(criteria: SearchCriteria): any {
    const transformed: any = { ...criteria };

    // Convert state arrays to comma-separated strings for backend
    if (Array.isArray(criteria.originState)) {
      transformed.originState = criteria.originState.join(',');
    }
    if (Array.isArray(criteria.destinationState)) {
      transformed.destinationState = criteria.destinationState.join(',');
    }

    // Ensure equipment type is an array (backend expects List<string>)
    if (criteria.equipmentType && !Array.isArray(criteria.equipmentType)) {
      transformed.equipmentType = [criteria.equipmentType];
    }

    // Format pickup dates to ISO strings
    if (criteria.pickupDates && Array.isArray(criteria.pickupDates)) {
      transformed.pickupDates = criteria.pickupDates.map(date =>
        date instanceof Date ? date.toISOString() : date
      );
    }

    return transformed;
  }
}
