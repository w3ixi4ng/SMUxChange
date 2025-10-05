<template>
<div class="container py-4">
    <!-- Jumbotron / Hero -->
    <div class="jumbotron-like text-center mb-4">
        <h1 class="display-5 fw-semibold">Exchange Information</h1>
        <p class="lead mb-0">Search and filter partner universities by name, country, or city.</p>
    </div>

    <!-- Search + Filters -->
    <div class="card shadow-sm mb-4">
        <div class="card-body">
            <div class="row g-3 align-items-end">
                <div class="col-12 col-md-6">
                    <label for="search" class="form-label">Search by school name</label>
                    <input
                        id="search"
                        type="text"
                        class="form-control"
                        placeholder="e.g., University of Toronto"
                        v-model="searchText"
                    />
                </div>
                    <div class="col-6 col-md-3">
                        <label for="country" class="form-label">Country</label>
                        <select id="country" class="form-select" v-model="filterCountry">
                            <option value="">All countries</option>
                            <option v-for="c in countries" :key="c" :value="c">{{ c }}</option>
                        </select>
                    </div>
                    <div class="col-6 col-md-3">
                        <label for="city" class="form-label">City</label>
                        <select id="city" class="form-select" v-model="filterCity">
                            <option value="">All cities</option>
                            <option v-for="c in cities" :key="c" :value="c">{{ c }}</option>
                        </select>
                    </div>
            </div>

        <!-- Results list -->
            <div class="mt-3">
                <div class="d-flex justify-content-between align-items-center mb-2">
                        <div class="text-muted small">
                            Showing {{ filteredSchools.length }} result(s)
                        </div>
                        <button class="btn btn-outline-secondary btn-sm" @click="resetFilters">Reset filters</button>
                </div>

                <div class="list-group results-list">
                    <button
                        v-for="s in filteredSchools"
                        :key="s.id"
                        type="button"
                        class="list-group-item list-group-item-action"
                        :class="{'active': selectedSchool && selectedSchool.id === s.id}"
                        @click="selectSchool(s)"
                    >
                        <div class="d-flex w-100 justify-content-between">
                            <h6 class="mb-1">{{ s.name }}</h6>
                            <small>{{ s.country }} • {{ s.city }}</small>
                        </div>
                    <small class="text-muted">{{ s.short }}</small>
                    </button>
                    <div v-if="filteredSchools.length === 0" class="list-group-item text-muted">
                        No schools match the current search or filters.
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Details panel -->
    <div class="card shadow-sm details-card">
        <div class="card-body" v-if="selectedSchool">
            <div class="d-flex justify-content-between align-items-start">
                <h4 class="card-title mb-2">{{ selectedSchool.name }}</h4>
                <span class="badge text-bg-primary">{{ selectedSchool.country }}</span>
            </div>

            <div class="mb-2">
                <span class="text-muted">Location:</span>
                <span class="ms-1">{{ selectedSchool.city }}, {{ selectedSchool.country }}</span>
            </div>

            <div class="mb-2">
                <span class="text-muted">Courses provided:</span>
                <div class="mt-1">
                    <span v-for="c in selectedSchool.courses" :key="c" class="chip">{{ c }}</span>
                </div>
            </div>

            <div class="mb-2">
                <span class="text-muted">Description of School:</span>
                <p class="mb-1">{{ selectedSchool.description }}</p>
            </div>

            <div class="mb-2">
                <span class="text-muted">GPA needed:</span>
                <span class="ms-1">{{ selectedSchool.gpa || 'TBD / Placeholder' }}</span>
            </div>

            <div class="mb-0">
                <span class="text-muted">Nearby attractions / accommodations:</span>
                <ul class="mt-2 mb-0">
                    <li v-for="a in selectedSchool.attractions" :key="a">{{ a }}</li>
                </ul>
            </div>
        </div>

        <div class="card-body text-muted" v-else>
            Select a school above to view details.
        </div>
    </div>
</div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';

// Sample data (replace with API later)
const sampleSchools = [
    {
    id: 1,
    name: 'University of Toronto',
    country: 'Canada',
    city: 'Toronto',
    short: 'Top Canadian research university',
    courses: ['Computer Science', 'Business', 'Mathematics', 'Economics'],
    description:
    'A leading research-intensive university renowned for innovation and academic excellence across disciplines.',
    gpa: '3.3+ (placeholder)',
    attractions: ['CN Tower', 'Royal Ontario Museum', 'Kensington Market'],
    },
    {
    id: 2,
    name: 'National University of Singapore',
    country: 'Singapore',
    city: 'Singapore',
    short: 'Asia\'s global university',
    courses: ['Information Systems', 'Accounting', 'Engineering', 'Design'],
    description:
    'A comprehensive research university with strong global rankings and vibrant campus life.',
    gpa: '3.5+ (placeholder)',
    attractions: ['Gardens by the Bay', 'Marina Bay Sands', 'Hawker Centres'],
    },
    {
    id: 3,
    name: 'ETH Zürich',
    country: 'Switzerland',
    city: 'Zürich',
    short: 'World-class STEM institution',
    courses: ['Data Science', 'Mechanical Engineering', 'Physics', 'Architecture'],
    description:
    'A premier science and technology university known for cutting-edge research and innovation.',
    gpa: '3.6+ (placeholder)',
    attractions: ['Lake Zürich', 'Old Town (Altstadt)', 'Uetliberg'],
    },
    {
    id: 4,
    name: 'University of Melbourne',
    country: 'Australia',
    city: 'Melbourne',
    short: 'Leading Australian university',
    courses: ['Finance', 'Software Engineering', 'Psychology', 'Design'],
    description:
    'A top institution offering diverse programs and a thriving research environment.',
    gpa: '3.4+ (placeholder)',
    attractions: ['Queen Victoria Market', 'Federation Square', 'Great Ocean Road'],
    },
    {
    id: 5,
    name: 'Hanyang University',
    country: 'South Korea',
    city: 'Seoul',
    short: 'Strong engineering and business',
    courses: ['Computer Engineering', 'Business Administration', 'Media', 'AI'],
    description:
    'A dynamic private university known for engineering excellence and industry connections.',
    gpa: '3.2+ (placeholder)',
    attractions: ['Dongdaemun', 'Han River Parks', 'Gwangjang Market'],
    },
];

const searchText = ref('');
const filterCountry = ref('');
const filterCity = ref('');
const schools = ref(sampleSchools);
const selectedSchool = ref(null);

const countries = computed(() =>
    [...new Set(schools.value.map(s => s.country))].sort()
);

const cities = computed(() => {
  const pool = filterCountry.value
    ? schools.value.filter(s => s.country === filterCountry.value)
    : schools.value;
    return [...new Set(pool.map(s => s.city))].sort();
});

const filteredSchools = computed(() => {
    const text = searchText.value.trim().toLowerCase();
    return schools.value
    .filter(s => {
    const matchesText =
        !text ||
        s.name.toLowerCase().includes(text) ||
        s.city.toLowerCase().includes(text) ||
        s.country.toLowerCase().includes(text);
        const matchesCountry = !filterCountry.value || s.country === filterCountry.value;
        const matchesCity = !filterCity.value || s.city === filterCity.value;
        return matchesText && matchesCountry && matchesCity;
    })
    .sort((a, b) => a.name.localeCompare(b.name));
});

function selectSchool(s) {
    selectedSchool.value = s;
}

function resetFilters() {
    searchText.value = '';
    filterCountry.value = '';
    filterCity.value = '';
}

watch(filteredSchools, (list) => {
    if (selectedSchool.value && !list.some(s => s.id === selectedSchool.value.id)) {
    selectedSchool.value = null;
    }
});

watch(filterCountry, () => {
    filterCity.value = '';
});

onMounted(() => {
    if (schools.value.length) selectedSchool.value = schools.value[0];
});
</script>

<style scoped>
.jumbotron-like {
    background-color: var(--bs-light);
    border-radius: .5rem;
    padding: 3rem 1rem;
}
@media (min-width: 768px) {
    .jumbotron-like { padding: 4rem 2rem; }
}
.details-card { min-height: 220px; }
.results-list { max-height: 360px; overflow-y: auto; }
.chip {
    display: inline-block;
    background: #eef2ff;
    color: #1d4ed8;
    border-radius: 999px;
    padding: 0.25rem 0.6rem;
    margin: 0 0.35rem 0.35rem 0;
    font-size: 0.875rem;
    border: 1px solid #c7d2fe;
}
</style>
