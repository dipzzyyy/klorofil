<script lang="ts">
    import { Card, CardContent } from "$lib/components/ui/card";
    import * as Accordion from "$lib/components/ui/accordion";
    import Heading from "$lib/components/heading.svelte";
    import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

    // Example data for 3 charts
    const data1 = [
        { name: 'A', value: 12 },
        { name: 'B', value: 18 },
        { name: 'C', value: 7 }
    ];

    const data2 = [
        { name: 'X', value: 24 },
        { name: 'Y', value: 30 },
        { name: 'Z', value: 14 }
    ];

    const data3 = [
        { name: 'P', value: 20 },
        { name: 'Q', value: 10 },
        { name: 'R', value: 25 }
    ];
</script>

<div class="space-y-6">
    <Heading size="h2">Dashboard Overview</Heading>

    <!-- Section 1 -->
    <Card>
        <CardContent class="p-4 space-y-2">
            <Heading size="h3">Section 1 Title</Heading>
            <Accordion.Root type="single" class="w-full sm:max-w-[70%]" value="item-1">
                <Accordion.Item value="desc1">
                    <Accordion.Trigger>Description</Accordion.Trigger>
                    <Accordion.Content>
                        This is the detailed description for section 1. It explains the data in the graph below.
                    </Accordion.Content>
                </Accordion.Item>
            </Accordion.Root>
            <div class="h-64">
                <!-- <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data1}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer> -->
            </div>
        </CardContent>
    </Card>
</div>
