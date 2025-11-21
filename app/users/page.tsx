import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
    const { data: users, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        return (
            <div className="p-8 text-center text-destructive">
                Error loading users: {error.message}
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Leads registrados</h1>
                <Link href="/form">
                </Link>
            </div>

            <Card>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead>Lead ID</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>WhatsApp</TableHead>
                                    <TableHead>Specialty</TableHead>
                                    <TableHead>Variant</TableHead>
                                    <TableHead>Address</TableHead>
                                    <TableHead>Avg Ticket</TableHead>
                                    <TableHead>Segment</TableHead>
                                    <TableHead>Created At</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users?.map((user) => (
                                    <TableRow key={user.lead_id || user.id}>
                                        <TableCell className="font-mono text-xs text-muted-foreground">{user.lead_id}</TableCell>
                                        <TableCell className="font-medium">{user.nombre}</TableCell>
                                        <TableCell>{user.whatsapp}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="capitalize">
                                                {user.especialidad}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{user.variant_shown}</Badge>
                                        </TableCell>
                                        <TableCell className="max-w-[200px]">
                                            <div className="truncate text-xs text-muted-foreground" title={JSON.stringify(user.address_json, null, 2)}>
                                                {user.address_json?.address || JSON.stringify(user.address_json)}
                                            </div>
                                        </TableCell>
                                        <TableCell>{user.average_ticket}</TableCell>
                                        <TableCell>{user.segment}</TableCell>
                                        <TableCell className="text-nowrap text-xs text-muted-foreground">
                                            {new Date(user.created_at).toLocaleDateString()} {new Date(user.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {users?.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                                            No users found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
