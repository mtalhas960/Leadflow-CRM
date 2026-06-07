"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useWorkspace } from "@/contexts/workspace-context";
import { createContract } from "@/lib/firebase/contracts";
import type { ContractType, ContractSigner } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/lib/toast";
import {
  ArrowLeft,
  Loader2,
  UserPlus,
  X,
  FileSignature,
  FileCheck,
} from "lucide-react";
import Link from "next/link";

export default function NewContractPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { activeWorkspace } = useWorkspace();

  const [title, setTitle] = useState("");
  const [type, setType] = useState<ContractType>(
    (searchParams?.get("type") as ContractType) || "contract"
  );
  const [clientId, setClientId] = useState(searchParams?.get("clientId") || "");
  const [projectId, setProjectId] = useState(searchParams?.get("projectId") || "");
  const [signers, setSigners] = useState<ContractSigner[]>([]);
  const [newSignerEmail, setNewSignerEmail] = useState("");
  const [newSignerName, setNewSignerName] = useState("");
  const [creating, setCreating] = useState(false);

  const handleAddSigner = () => {
    if (!newSignerEmail.trim()) return;
    const signer: ContractSigner = {
      id: `signer-${Date.now()}`,
      email: newSignerEmail.trim(),
      name: newSignerName.trim() || newSignerEmail.trim(),
      title: newSignerName.trim() || "Signer",
      type: "signer",
      status: "pending",
      required: true,
    };
    setSigners([...signers, signer]);
    setNewSignerEmail("");
    setNewSignerName("");
  };

  const handleRemoveSigner = (id: string) => {
    setSigners(signers.filter((s) => s.id !== id));
  };

  const handleCreate = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!activeWorkspace?.id) return;

    setCreating(true);
    try {
      const contractId = await createContract(activeWorkspace.id, {
        contractTitle: title.trim(),
        type,
        clientId: clientId || null,
        projectId: projectId || null,
        signers,
      });
      toast.success(`${type === "contract" ? "Contract" : "Proposal"} created`);
      router.push(`/contracts/${contractId}`);
    } catch {
      toast.error("Failed to create contract");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/contracts">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">New {type === "contract" ? "Contract" : "Proposal"}</h1>
          <p className="text-sm text-muted-foreground">
            Create a new document to send for signatures
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-5">
          {/* Type toggle */}
          <div>
            <Label className="text-sm font-medium">Document Type</Label>
            <div className="flex gap-2 mt-1.5">
              <button
                type="button"
                onClick={() => setType("contract")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition-colors ${
                  type === "contract"
                    ? "border-primary bg-primary/5 text-primary font-medium"
                    : "border-input hover:border-primary/50"
                }`}
              >
                <FileSignature className="h-4 w-4" />
                Contract
              </button>
              <button
                type="button"
                onClick={() => setType("proposal")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition-colors ${
                  type === "proposal"
                    ? "border-primary bg-primary/5 text-primary font-medium"
                    : "border-input hover:border-primary/50"
                }`}
              >
                <FileCheck className="h-4 w-4" />
                Proposal
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="title" className="text-sm font-medium">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={`${type === "contract" ? "Contract" : "Proposal"} title`}
              className="mt-1.5"
            />
          </div>

          {/* Client / Project */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="clientId" className="text-sm font-medium">Client ID</Label>
              <Input
                id="clientId"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                placeholder="Optional client ID"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="projectId" className="text-sm font-medium">Project ID</Label>
              <Input
                id="projectId"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                placeholder="Optional project ID"
                className="mt-1.5"
              />
            </div>
          </div>

          <Separator />

          {/* Signers */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium">Signers</Label>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1 text-xs"
                onClick={handleAddSigner}
                disabled={!newSignerEmail.trim()}
              >
                <UserPlus className="h-3.5 w-3.5" />
                Add
              </Button>
            </div>
            <div className="flex gap-2 mb-3">
              <Input
                value={newSignerEmail}
                onChange={(e) => setNewSignerEmail(e.target.value)}
                placeholder="Email"
                className="flex-1 text-sm"
                onKeyDown={(e) => e.key === "Enter" && handleAddSigner()}
              />
              <Input
                value={newSignerName}
                onChange={(e) => setNewSignerName(e.target.value)}
                placeholder="Name (optional)"
                className="flex-1 text-sm"
                onKeyDown={(e) => e.key === "Enter" && handleAddSigner()}
              />
            </div>
            {signers.length > 0 && (
              <div className="space-y-1.5 mt-2">
                {signers.map((signer) => (
                  <div
                    key={signer.id}
                    className="flex items-center justify-between px-3 py-2 rounded-md bg-muted/50 text-sm"
                  >
                    <div>
                      <span className="font-medium">{signer.name}</span>
                      <span className="text-muted-foreground ml-2">{signer.email}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                      onClick={() => handleRemoveSigner(signer.id)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            {signers.length === 0 && (
              <p className="text-xs text-muted-foreground">No signers added yet. You can add them later.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" asChild>
          <Link href="/contracts">Cancel</Link>
        </Button>
        <Button onClick={handleCreate} disabled={creating || !title.trim()}>
          {creating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            `Create ${type === "contract" ? "Contract" : "Proposal"}`
          )}
        </Button>
      </div>
    </div>
  );
}
