export async function submitWeb3FormsReview({ name, email, rating, category, review }) {
  const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

  if (!accessKey || !accessKey.trim()) {
    return {
      success: false,
      message: "Feedback service is currently offline. Web3Forms access key is not configured in .env."
    };
  }

  const subject = `New ${rating}-Star Review (${category}): ${name || "Anonymous User"}`;

  const payload = {
    access_key: accessKey.trim(),
    name: name || "Anonymous User",
    email: email || "no-email-provided@myresumebuilder.app",
    subject,
    rating: `${rating} / 5 Stars`,
    category: category || "User Experience",
    message: review || "(No written comments provided)",
    from_name: "MyResume Builder App"
  };

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (response.ok && data.success) {
      return {
        success: true,
        message: "Thank you for your rating and feedback!"
      };
    } else {
      return {
        success: false,
        message: data.message || "Failed to submit review via Web3Forms."
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error?.message || "Network error submitting feedback."
    };
  }
}
