<?php
namespace Magelearn\DeliveryDate\Observer;

use Magento\Framework\Event\Observer as EventObserver;
use Magento\Framework\Event\ObserverInterface;
use Magelearn\DeliveryDate\Model\Validator;

class SalesModelServiceQuoteSubmitBefore implements ObserverInterface
{    
    /**
     * @var Validator
     */
    private $validator;
	
	/**
     * @var \Magento\Framework\DataObject\Copy
     */
    protected $objectCopyService;
	
    /**
     * SalesModelServiceQuoteSubmitBefore constructor.
     *
     * @param Validator $validator
	 * @param \Magento\Framework\DataObject\Copy $objectCopyService
     */
    public function __construct(
        Validator $validator,
        \Magento\Framework\DataObject\Copy $objectCopyService
    ) {
        $this->validator = $validator;
		$this->objectCopyService = $objectCopyService;
    }

    /**
     * @param EventObserver $observer
     * @return $this
     * @throws \Exception
     */
    public function execute(EventObserver $observer)
    {
        /** @var \Magento\Sales\Model\Order $order */
		$order = $observer->getEvent()->getData('order');
		/** @var \Magento\Quote\Model\Quote $quote */
		$quote = $observer->getEvent()->getData('quote');
        if (!$this->validator->validate($quote->getDeliveryDate())) {
            throw new \Exception(__('Invalid Delevery Date'));
        }
        $order->setDeliveryDate($quote->getDeliveryDate());
        $order->setDeliveryComment($quote->getDeliveryComment());
		
		$this->objectCopyService->copyFieldsetToTarget('sales_convert_quote', 'to_order', $quote, $order);
		
        return $this;
    }
}