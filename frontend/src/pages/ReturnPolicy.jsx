import React from 'react';
import { FaUndo, FaClock, FaShieldAlt, FaTruck, FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from 'react-icons/fa';

const ReturnPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <FaUndo className="text-4xl text-pink-500 mr-4" />
            <h1 className="text-4xl font-bold text-gray-900">30-Day Return Policy</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Shop with confidence knowing you have 30 days to return or exchange your purchase. 
            We want you to be completely satisfied with your Electro Kart experience.
          </p>
        </div>

        {/* Quick Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <FaClock className="text-3xl text-blue-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">30 Days</h3>
            <p className="text-gray-600 text-sm">Full return window from delivery date</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <FaShieldAlt className="text-3xl text-green-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">100% Secure</h3>
            <p className="text-gray-600 text-sm">Safe and secure return process</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <FaTruck className="text-3xl text-purple-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Free Returns</h3>
            <p className="text-gray-600 text-sm">No return shipping charges</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-8 py-6">
            
            {/* Eligibility Section */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FaCheckCircle className="text-green-500 mr-3" />
                Return Eligibility
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <FaCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Time Frame</h3>
                    <p className="text-gray-600">Items must be returned within 30 days of delivery date</p>
                  </div>

                </div>
                <div className="flex items-start">
                  <FaCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Original Condition</h3>
                    <p className="text-gray-600">Items must be in original packaging with all accessories, manuals, and tags</p>
                  </div>

                </div>
                <div className="flex items-start">
                  <FaCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Proof of Purchase</h3>
                    <p className="text-gray-600">Valid order number or receipt required</p>
                  </div>

                </div>
                <div className="flex items-start">
                  <FaCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">No Damage</h3>
                    <p className="text-gray-600">Items must be free from damage, wear, or misuse</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Non-Returnable Items */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FaTimesCircle className="text-red-500 mr-3" />
                Non-Returnable Items
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <FaTimesCircle className="text-red-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Personalized Items</h3>
                    <p className="text-gray-600">Custom engraved or personalized products</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FaTimesCircle className="text-red-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Software & Digital Products</h3>
                    <p className="text-gray-600">Downloaded software, digital licenses, or activated products</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FaTimesCircle className="text-red-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Hygiene Products</h3>
                    <p className="text-gray-600">Earbuds, headphones, or other personal hygiene items</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FaTimesCircle className="text-red-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Gift Cards</h3>
                    <p className="text-gray-600">Prepaid gift cards or store credits</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Return Process */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FaTruck className="text-blue-500 mr-3" />
                How to Return
              </h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">1</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Initiate Return</h3>
                    <p className="text-gray-600">Log into your account and go to "My Orders" to start the return process</p>
                  </div>

                </div>
                <div className="flex items-start">
                  <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">2</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Select Items</h3>
                    <p className="text-gray-600">Choose the items you want to return and provide reason for return</p>
                  </div>

                </div>
                <div className="flex items-start">
                  <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">3</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Print Label</h3>
                    <p className="text-gray-600">Download and print the prepaid return shipping label</p>
                  </div>

                </div>
                <div className="flex items-start">
                  <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">4</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Package Items</h3>
                    <p className="text-gray-600">Pack items securely in original packaging with the return label</p>
                  </div>

                </div>
                <div className="flex items-start">
                  <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">5</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Ship Back</h3>
                    <p className="text-gray-600">Drop off at any authorized shipping location or schedule pickup</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Refund Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FaShieldAlt className="text-green-500 mr-3" />
                Refund Information
              </h2>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <FaCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Processing Time</h3>
                      <p className="text-gray-600">Refunds processed within 5-7 business days after receiving returned items</p>
                    </div>

                  </div>
                  <div className="flex items-start">
                    <FaCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Refund Method</h3>
                      <p className="text-gray-600">Refunds issued to original payment method used for purchase</p>
                    </div>

                  </div>
                  <div className="flex items-start">
                    <FaCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Free Return Shipping</h3>
                      <p className="text-gray-600">We cover return shipping costs for eligible returns</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Exchange Policy */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FaUndo className="text-purple-500 mr-3" />
                Exchange Policy
              </h2>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Need a different size, color, or model? We offer hassle-free exchanges within 30 days of delivery.
                </p>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Exchange Process</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Follow the same return process as above</li>
                    <li>• Select "Exchange" instead of "Return"</li>
                    <li>• Choose your desired replacement item</li>
                    <li>• Pay any price difference if applicable</li>
                    <li>• New item ships once return is received</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Important Notes */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FaExclamationTriangle className="text-yellow-500 mr-3" />
                Important Notes
              </h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-yellow-600 mr-2">•</span>
                    <span>Return shipping is free for eligible returns. We'll provide a prepaid label.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 mr-2">•</span>
                    <span>Items must be in original condition with all packaging and accessories.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 mr-2">•</span>
                    <span>We reserve the right to refuse returns that don't meet our policy requirements.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 mr-2">•</span>
                    <span>For damaged or defective items, contact us immediately for expedited processing.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 mr-2">•</span>
                    <span>This policy applies to all purchases made through Electro Kart website and mobile app.</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Contact Information */}
            <section className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help?</h2>
              <p className="text-gray-600 mb-6">
                Have questions about our return policy or need assistance with a return?
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="mailto:support@electrokart.com" 
                  className="bg-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-600 transition-colors"
                >
                  Email Support
                </a>
                <a 
                  href="tel:+919876543210" 
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                >
                  Call Us
                </a>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicy;

  
