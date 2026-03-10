import type { PageServerLoad } from './$types';
import { apiClient } from '$lib/api';

export const load: PageServerLoad = async ({ url }) => {

	const year = url.searchParams.get('year') ?? '2567';
	const semester = url.searchParams.get('semester') ?? '1';
	const campus = url.searchParams.get('campus') ?? 'BANGKHEN';

	const res = await apiClient.get(
		`applications/result?year=${year}&semester=${semester}&campus=${campus}`
	);

	return {
		awards: res.data,
		selectedYear: year,
		selectedSemester: semester,
		selectedCampus: campus
	};
};