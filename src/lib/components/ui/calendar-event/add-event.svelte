<script lang="ts">
	import { superValidate } from 'sveltekit-superforms/client';
	import { eventSchema } from '$lib/schemas/event-schema.js';
	import { onMount } from 'svelte';
    import { CalendarDate, type DateValue } from "@internationalized/date";
	import { Button } from '$lib/components/ui/button/index.js';
    import { enhance } from "$app/forms";
    import { Input } from '$lib/components/ui/input';
    import { Label } from '$lib/components/ui/label';
    import { Textarea } from '$lib/components/ui/textarea';
    import { RangeCalendar } from '$lib/components/ui/range-calendar';
</script>