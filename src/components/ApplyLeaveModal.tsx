import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload } from "lucide-react";
import { toast } from "sonner";

interface ApplyLeaveModalProps {
  open: boolean;
  onClose: () => void;
  initialLeaveType?: string;
  initialFile?: File | null;
}

export default function ApplyLeaveModal({
  open,
  onClose,
  initialLeaveType,
  initialFile,
}: ApplyLeaveModalProps) {
  const [leaveType, setLeaveType] = useState<string>(initialLeaveType || "");
  const [employee, setEmployee] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [file, setFile] = useState<File | null>(initialFile || null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setLeaveType(initialLeaveType || "");
  }, [initialLeaveType]);

  useEffect(() => {
    setFile(initialFile || null);
  }, [initialFile]);

  const onFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0];
    if (f) setFile(f);
  };

  const triggerFileChooser = () => fileInputRef.current?.click();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Simulate form submission
      await new Promise((r) => setTimeout(r, 700));
      toast.success("Leave request submitted successfully!");
      
      // Reset form
      setEmployee("");
      setLeaveType("");
      setStartDate("");
      setEndDate("");
      setReason("");
      setFile(null);
      onClose();
    } catch (err) {
      toast.error("Failed to submit leave request");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Apply for Leave</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="employee">Employee Name</Label>
            <Input
              id="employee"
              value={employee}
              onChange={(e) => setEmployee(e.target.value)}
              placeholder="Enter employee name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="leaveType">Leave Type</Label>
            <Select value={leaveType} onValueChange={setLeaveType} required>
              <SelectTrigger id="leaveType">
                <SelectValue placeholder="Select leave type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Annual">Annual Leave</SelectItem>
                <SelectItem value="Sick">Sick Leave</SelectItem>
                <SelectItem value="Personal">Personal Leave</SelectItem>
                <SelectItem value="Maternity">Maternity/Paternity Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for leave"
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Attachment (optional)</Label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={onFileSelected}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={triggerFileChooser}
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              {file ? file.name : "Choose File"}
            </Button>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Submit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
