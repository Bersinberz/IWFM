// controllers/alertController.ts
import { Request, Response } from 'express';
import Alert from "../models/alerts";
import nodemailer from 'nodemailer';

interface AlertResponse {
  id: string;
  type: string;
  severity: "low" | "medium" | "high";
  tanker: string;
  ts: string;
  description: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  count?: number;
}

// Define interface for lean documents
interface LeanAlert {
  _id: any;
  type: string;
  severity: string;
  tanker: string;
  ts: Date;
  description: string;
}

export const getAlerts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { severity, startDate, endDate } = req.query;
    
    let filter: any = {};
    
    if (severity && severity !== 'all') {
      filter.severity = severity;
    }
    
    if (startDate || endDate) {
      filter.ts = {};
      if (startDate) {
        filter.ts.$gte = new Date(startDate as string);
      }
      if (endDate) {
        const end = new Date(endDate as string);
        end.setHours(23, 59, 59, 999);
        filter.ts.$lte = end;
      }
    }
    
    // Use type assertion for lean results
    const alerts = await Alert.find(filter)
      .sort({ ts: -1 })
      .lean() as LeanAlert[];
    
    const formattedAlerts: AlertResponse[] = alerts.map(alert => ({
      id: alert._id.toString(),
      type: alert.type,
      severity: alert.severity as "low" | "medium" | "high",
      tanker: alert.tanker,
      ts: formatDateForFrontend(alert.ts),
      description: alert.description
    }));
    
    const response: ApiResponse<AlertResponse[]> = {
      success: true,
      data: formattedAlerts,
      count: formattedAlerts.length
    };
    
    res.json(response);
    
  } catch (error) {
    console.error('Error fetching alerts:', error);
    const response: ApiResponse<null> = {
      success: false,
      message: 'Server error while fetching alerts',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    res.status(500).json(response);
  }
};

const formatDateForFrontend = (date: Date): string => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

export const sendAlertEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Find the alert by ID
    const alert = await Alert.findById(id);
    
    if (!alert) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Alert not found'
      };
      res.status(404).json(response);
      return;
    }

    // Send email
    await sendEmail(alert);

    const response: ApiResponse<null> = {
      success: true,
      message: 'Alert email sent successfully to bersinberz04@gmail.com'
    };
    
    res.json(response);
    
  } catch (error) {
    console.error('Error sending alert email:', error);
    const response: ApiResponse<null> = {
      success: false,
      message: 'Failed to send alert email',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    res.status(500).json(response);
  }
};

// Email sending function
const sendEmail = async (alert: any): Promise<void> => {
  try {
    // Create transporter - using Gmail as example
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Use app password for Gmail
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'bersinberz04@gmail.com',
      subject: `🚨 ALERT: ${alert.type} - ${alert.tanker} (${alert.severity.toUpperCase()})`,
      html: generateEmailTemplate(alert),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to bersinberz04@gmail.com:', info.messageId);
    
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email to bersinberz04@gmail.com');
  }
};

// Generate HTML email template
const generateEmailTemplate = (alert: any): string => {
  const severityColors = {
    high: '#dc3545',
    medium: '#ffc107', 
    low: '#6c757d'
  };

  const color = severityColors[alert.severity as keyof typeof severityColors] || '#6c757d';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          line-height: 1.6;
          color: #333;
        }
        .alert-container { 
          max-width: 600px; 
          margin: 0 auto; 
          border: 1px solid #ddd;
          border-radius: 8px;
          overflow: hidden;
        }
        .alert-header { 
          background: ${color}; 
          color: white; 
          padding: 20px; 
          text-align: center;
        }
        .alert-content { 
          padding: 20px; 
          background: #f8f9fa;
        }
        .alert-detail { 
          margin-bottom: 10px; 
        }
        .alert-detail strong { 
          color: #495057;
        }
        .footer { 
          text-align: center; 
          padding: 15px; 
          background: #e9ecef; 
          color: #6c757d;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="alert-container">
        <div class="alert-header">
          <h2>🚨 ALERT NOTIFICATION</h2>
          <h3>${alert.type}</h3>
        </div>
        <div class="alert-content">
          <div class="alert-detail"><strong>Tanker:</strong> ${alert.tanker}</div>
          <div class="alert-detail"><strong>Severity:</strong> ${alert.severity.toUpperCase()}</div>
          <div class="alert-detail"><strong>Time:</strong> ${formatDateForFrontend(alert.ts)}</div>
          <div class="alert-detail"><strong>Description:</strong> ${alert.description}</div>
          <div style="margin-top: 20px; padding: 15px; background: white; border-radius: 5px; border-left: 4px solid ${color};">
            <strong>Action Required:</strong> Please review this alert and take appropriate action immediately.
          </div>
        </div>
        <div class="footer">
          This is an automated alert from your monitoring system.
        </div>
      </div>
    </body>
    </html>
  `;
};